defmodule YoutubeTvWeb.VideoView do
  use YoutubeTvWeb, :view
  alias YoutubeTvWeb.VideoView

  def render("index.json", %{videos: videos}) do
    %{data: render_many(videos, VideoView, "video.json")}
  end

  def render("show.json", %{video: video}) do
    %{data: render_one(video, VideoView, "video.json")}
  end

  def render("video.json", %{video: video}) do
    %{
      id: video.id,
      video_ids: video.youtube_id_list,
      first_video_id: video.first_video_id
    }
  end
end
