import { Request, Response } from "express";

import { Post } from "../models/posts";
const { OpenAI } = require("openai");

// Initializing OpenAI client with the key from env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateTLDR = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    //Fetch the blog post from DB
    const blog = await Post.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    //cache hit : check if summary already exists
    if (blog?.summary) {
      console.log("Cache hit! Returning existing summary from DB.");
      return res.status(200).json({ summary: blog.summary });
    }

    // Edge-case handling: Validate if blog content actually exists
    if (!blog.content || blog.content.trim().length < 50) {
      return res
        .status(400)
        .json({ message: "Blog text is too short to summarize." });
    }

    //cache miss

    //if the blog post is too long, truncate it to fit within the token limit for the model
    const maxTokenLimit = 4000; // roughly 1000 tokens
    let safeContent = blog.content;

    if (safeContent.length > maxTokenLimit) {
      safeContent = safeContent.slice(0, maxTokenLimit);

      //smart cutoff: Find the last space to avoid sending half a word ("finan" instead of "finance")
      const lastSpaceIndex = safeContent.lastIndexOf(" ");
      if (lastSpaceIndex > 0) {
        safeContent = safeContent.slice(0, lastSpaceIndex);
      }

      console.warn(
        "Blog content exceeds token limit. Truncating to fit within model constraints."
      );
    }

    //generate summary using OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert editor. Summarize the following blog post text into exactly 3 sentences. Maintain an informative tone. Do not add any conversational intro or outro filler text.",
        },
        {
          role: "user",
          content: blog.content, // Pass the raw blog body text
        },
      ],
      max_tokens: 150, // Limits generation length to protect your budget
      temperature: 0.5, // Keeps responses focused and structured
    });

    //Extract the clean summary text from the response payload
    const summaryText = response.choices[0].message.content;

    // Save the generated summary back to the blog document for caching
    blog.summary = summaryText;
    await blog.save();

    return res.status(200).json({ summary: summaryText });
  } catch (error) {
    console.error("OpenAI Integration Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error processing AI summary" });
  }
};
