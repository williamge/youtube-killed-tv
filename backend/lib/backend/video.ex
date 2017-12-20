defmodule YoutubeTv.Video do
  use Ecto.Schema
  import Ecto.Changeset
  alias YoutubeTv.Video


  schema "videos" do
    field :youtube_id_list, {:array, :string}

    timestamps()
  end

  @doc false
  def changeset(%Video{} = video, attrs) do
    video
    |> cast(attrs, [:youtube_id_list])
    |> validate_required([:youtube_id_list])
  end
end
