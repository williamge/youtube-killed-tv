defmodule YoutubeTvWeb.SkipController do
  use YoutubeTvWeb, :controller


  action_fallback YoutubeTvWeb.FallbackController

  def report(conn, %{
    "first_video_id" => first_video_id,
    "part_skipped_on" => part_skipped_on,
    "time" => time_skipped
  }) do
    alias YoutubeTv.Skip

    ip = get_ip_string_from_connection(conn)

    changeset = Skip.changeset(%Skip{}, %{
      first_video_id: first_video_id,
      part_skipped_on: part_skipped_on,
      time_skipped: DateTime.from_unix!(time_skipped, :seconds),
      ip: ip      
    })

    YoutubeTv.Repo.insert!(changeset)

    json(conn, %{result: "success"})
  end

  defp get_ip_string_from_connection(connection) do
    connection.remote_ip
    |> Tuple.to_list
    |> Enum.join(".")
  end
end
