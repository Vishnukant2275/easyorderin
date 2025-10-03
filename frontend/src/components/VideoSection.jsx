import React from "react";

function VideoSection() {
  return (
    <section className="py-5 text-center">
      <div className="container">
        <h2 className="mb-4">Watch How It Works</h2>
        <div className="ratio ratio-16x9">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/xdZiUuwZeOI?si=0x-3bnEofc55a6Jg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
      </div>
    </section>
  );
}

export default VideoSection;
