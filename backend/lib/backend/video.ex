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
end
