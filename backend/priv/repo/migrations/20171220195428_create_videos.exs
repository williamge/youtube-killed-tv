defmodule YoutubeTv.Repo.Migrations.CreateVideos do
  use Ecto.Migration

  def change do
    create table(:videos) do
      add :youtube_ids, :string

      timestamps()
    end

  end
end
