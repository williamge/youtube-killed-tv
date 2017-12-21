defmodule YoutubeTv.Video do
  use Ecto.Schema
  import Ecto.Changeset
  alias YoutubeTv.Video


  schema "videos" do
    field :first_video_id, :string
    field :youtube_id_list, {:array, :string}

    timestamps()
  end

  @doc false
  def changeset(%Video{} = video, attrs) do
    video
    |> cast(attrs, [:youtube_id_list, :first_video_id])
    |> validate_required([:youtube_id_list, :first_video_id])
  end

  def get_random_videos(seed, percent_of_table \\ 100) when is_integer(seed) do 
    result = YoutubeTv.Repo.query!("
      SELECT id, youtube_id_list, first_video_id FROM videos TABLESAMPLE BERNOULLI ($1) REPEATABLE ($2);
    ", [percent_of_table, seed])

    Enum.map(result.rows, &YoutubeTv.Repo.load(Video, {result.columns, &1}))
  end
end
