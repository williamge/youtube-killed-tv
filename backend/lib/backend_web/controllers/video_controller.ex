defmodule YoutubeTvWeb.VideoController do
  use YoutubeTvWeb, :controller


  action_fallback YoutubeTvWeb.FallbackController

  def index(conn, _params) do
    videos = YoutubeTv.Repo.all(YoutubeTv.Video)
    render(conn, "index.json", videos: videos)
  end

  def next(conn, _params) do
    video = YoutubeTv.Repo.get(YoutubeTv.Video, 1)
    render(conn, "show.json", video: video)
  end
end
