defmodule YoutubeTvWeb.VideoController do
  use YoutubeTvWeb, :controller


  action_fallback YoutubeTvWeb.FallbackController

  def index(conn, _params) do
    videos = YoutubeTv.Repo.all(YoutubeTv.Video)
    render(conn, "index.json", videos: videos)
  end

  def next(conn, %{"seed" => seed}) do
    integer_seed = String.to_integer seed

    videos = YoutubeTv.Video.get_random_videos(integer_seed)

    render(conn, "index.json", videos: videos)
  end
end
