defmodule YoutubeTvWeb.VideoController do
  use YoutubeTvWeb, :controller


  action_fallback YoutubeTvWeb.FallbackController

  def index(conn, _params) do
    videos = YoutubeTv.Repo.all(YoutubeTv.Video)
    render(conn, "index.json", videos: videos)
  end

  def next(conn, %{"seed" => seed}) do
    percent_of_table = 100;

    %{rows: rows} = YoutubeTv.Repo.query!("
      SELECT id, youtube_id_list FROM videos TABLESAMPLE BERNOULLI ($1) REPEATABLE ($2);
    ", [percent_of_table, String.to_integer seed])

    videos = rows
    |> Enum.map(fn [ id, youtube_id_list] -> %{ id: id, youtube_id_list: youtube_id_list } end)


    render(conn, "index.json", videos: videos)
  end
end
