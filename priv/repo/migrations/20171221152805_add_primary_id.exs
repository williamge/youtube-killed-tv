defmodule YoutubeTv.Repo.Migrations.AddPrimaryId do
  use Ecto.Migration

  def change do
    alter table(:videos) do
      add :first_video_id, :string
    end
  end
end
