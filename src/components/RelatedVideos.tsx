"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import videos from "@/data/youtube-video-list.json";
import { usePlausible } from "next-plausible";

interface Video {
  title: string;
  link: string;
}

interface RelatedVideosProps {
  slug: string;
}

function getYouTubeId(url: string) {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function VideoCard({ video, onClick }: { video: Video; onClick: () => void }) {
  const videoId = getYouTubeId(video.link);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : null;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
      <button
        onClick={onClick}
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
      >
        {thumbnailUrl && (
          <div className="relative aspect-video">
            <Image
              src={thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-black/70 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2">{video.title}</h3>
        </div>
      </button>
    </div>
  );
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const videoId = getYouTubeId(video.link);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-lg line-clamp-1">{video.title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="relative aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

export default function RelatedVideos({ slug }: RelatedVideosProps) {
  const [showAll, setShowAll] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const plausible = usePlausible();

  const videoData = videos.find((v) => v.slug === slug)?.recommendations;

  if (!videoData || videoData.length === 0) {
    return null;
  }

  const displayVideos = showAll ? videoData : videoData.slice(0, 5);

  const handleLoadMore = () => {
    setShowAll(true);
    plausible("load-more-videos", {
      props: {
        slug,
        total_videos: videoData.length,
      },
    });
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    plausible("video-click", {
      props: {
        slug,
        video_title: video.title,
      },
    });
  };

  return (
    <div className="mt-8 pt-8">
      <h2 className="text-2xl font-bold mb-4">Related Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayVideos.map((video, index) => (
          <VideoCard
            key={index}
            video={video}
            onClick={() => handleVideoClick(video)}
          />
        ))}
      </div>

      {!showAll && videoData.length > 5 && (
        <button
          onClick={handleLoadMore}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Show {videoData.length - 5} More Videos
        </button>
      )}

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}
