const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <section className="max-w-2xl mx-auto p-3 text-center">
        <div>
          <h1 className="text-3xl font-semibold text-center my-7">
            About Blog Smith
          </h1>
          <div className="text-lg text-gray-700 dark:text-gray-200 flex flex-col gap-6">
            <p>
              Welcome to <strong>Blog Smith</strong>, where your thoughts are
              forged into powerful posts. Whether you're a casual blogger, a
              professional writer, or a business sharing insights on
              programming, travel, finance, and more, Blog Smith provides the
              perfect space to express yourself. With a clean and
              beginner-friendly interface, anyone can start writing and
              connecting with a wider audience in just a few clicks.
            </p>
            <p>
              Our intuitive <strong>dashboard</strong> lets you track your
              blogging journey effortlessly. View and analyze your posts'
              performance, including likes and comments, over the past month to
              understand your audience's engagement. Stay in control with easy
              profile updates, including username and password changes. Plus,
              with <strong>dark mode</strong>, you can customize your reading
              and writing experience to suit your style.
            </p>
            <p>
              More than just a writing platform, Blog Smith fosters{" "}
              <strong>community and engagement</strong>. Discover inspiring
              content from other bloggers, interact through likes and comments,
              and build connections with like-minded individuals. Whether you're
              here to share knowledge, tell stories, or grow your personal
              brand, Blog Smith gives you the tools to turn ideas into impact.
              Start writing today and forge your mark in the blogging world!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
