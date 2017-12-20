defmodule YoutubeTvWeb.VideoController do
  use YoutubeTvWeb, :controller

  alias YoutubeTv.Videos
  alias YoutubeTv.Videos.Video

  action_fallback YoutubeTvWeb.FallbackController

  def index(conn, _params) do
    videos = Videos.list_videos()
    render(conn, "index.json", videos: videos)
  end
end
