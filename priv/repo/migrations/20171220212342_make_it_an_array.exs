defmodule YoutubeTv.Repo.Migrations.MakeItAnArray do
  use Ecto.Migration

  def change do
    alter table(:videos) do
      add :youtube_id_list, {:array, :string}
      remove :youtube_ids
    end
  end
end
