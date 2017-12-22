defmodule YoutubeTv.Repo.Migrations.AddVideoidAsIndex do
  use Ecto.Migration

  def change do
    create unique_index(:videos, [:first_video_id] )
  end
end
