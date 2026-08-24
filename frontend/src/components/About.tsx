const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 dark:bg-transparent p-4 font-sans relative overflow-hidden">
      {/* Subtle Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <section className="max-w-4xl mx-auto w-full relative z-10 py-12">
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-[2rem] shadow-xl p-8 md:p-14">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-10 text-center text-slate-900 dark:text-white">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
              BlogSmith
            </span>
          </h1>

          <div className="text-lg text-slate-600 dark:text-slate-300 flex flex-col gap-6 leading-relaxed">
            <p>
              Welcome to{" "}
              <strong className="text-slate-800 dark:text-slate-100 font-semibold">
                Blog Smith
              </strong>
              , where your thoughts are forged into powerful posts. Whether
              you're a casual blogger, a professional writer, or a business
              sharing insights on programming, travel, finance, and more, Blog
              Smith provides the perfect space to express yourself. With a clean
              and beginner-friendly interface, anyone can start writing and
              connecting with a wider audience in just a few clicks.
            </p>
            <p>
              Our intuitive{" "}
              <strong className="text-slate-800 dark:text-slate-100 font-semibold">
                dashboard
              </strong>{" "}
              lets you track your blogging journey effortlessly. View and
              analyze your posts' performance, including likes and comments,
              over the past month to understand your audience's engagement. Stay
              in control with easy profile updates, including username and
              password changes. Plus, with{" "}
              <strong className="text-slate-800 dark:text-slate-100 font-semibold">
                dark mode
              </strong>
              , you can customize your reading and writing experience to suit
              your style.
            </p>
            <p>
              More than just a writing platform, Blog Smith fosters{" "}
              <strong className="text-slate-800 dark:text-slate-100 font-semibold">
                community and engagement
              </strong>
              . Discover inspiring content from other bloggers, interact through
              likes and comments, and build connections with like-minded
              individuals. Whether you're here to share knowledge, tell stories,
              or grow your personal brand, Blog Smith gives you the tools to
              turn ideas into impact. Start writing today and forge your mark in
              the blogging world!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
