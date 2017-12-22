defmodule YoutubeTv.Repo.Migrations.CreateSkips do
  use Ecto.Migration

  def change do
    create table(:skips) do
      add :first_video_id, references("videos", type: :string, column: :first_video_id), null: false
      add :part_skipped_on, :integer
      add :time_skipped, :naive_datetime
      add :ip, :string

      timestamps()
    end
  end
end
