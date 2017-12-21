defmodule YoutubeTv.Skip do
  use Ecto.Schema
  import Ecto.Changeset
  alias YoutubeTv.Skip


  schema "skips" do
    belongs_to :video, YoutubeTv.Video, [type: :string, foreign_key: :first_video_id, references: :first_video_id] 
    field :ip, :string
    field :part_skipped_on, :integer
    field :time_skipped, :naive_datetime

    timestamps()
  end

  @doc false
  def changeset(%Skip{} = report, attrs) do
    report
    |> cast(attrs, [:first_video_id, :part_skipped_on, :time_skipped, :ip])
    |> validate_required([:first_video_id, :part_skipped_on, :time_skipped, :ip])
    |> assoc_constraint(:video)
  end
end
