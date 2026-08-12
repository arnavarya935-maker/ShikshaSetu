'use client';

type VideoPlayerProps = {
  url: string;
  title?: string;
};

function isYouTubeEmbed(url: string): boolean {
  return url.includes('youtube.com/embed') || url.includes('youtu.be');
}

export default function VideoPlayer({ url, title }: VideoPlayerProps) {
  if (!url) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-[1.5rem] border border-slate-800/70 bg-slate-900/80">
        <p className="text-sm text-slate-500">No video available for this lesson</p>
      </div>
    );
  }

  if (isYouTubeEmbed(url)) {
    return (
      <div className="aspect-video overflow-hidden rounded-[1.5rem] border border-slate-800/70 bg-slate-900">
        <iframe
          src={url}
          title={title ?? 'Video lesson'}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-800/70 bg-slate-900">
      <video
        src={url}
        controls
        className="aspect-video w-full"
        title={title}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
