NimbleCSV.define(MyParser, separator: ",", escape: "\"")

defmodule CsvSanity do
    def url_or_videoid_to_videoid(url) do
        if String.contains? url, "?" do
        [_, query_string] = String.split url, "?", parts: 2
        query_strings = String.split query_string, "&"
        video_part = Enum.find(query_strings, &(String.contains? &1, "v="))
        [_, videoid] = String.split video_part, "v="

        videoid
        else
            url
        end
    end

    def sanitize_video_ids(video_ids) when is_list(video_ids) do 
        video_ids
        |> Enum.map(&CsvSanity.url_or_videoid_to_videoid/1)
        |> Enum.reject(&(&1 == ""))
    end
end


Path.join(:code.priv_dir(:backend), "repo/csv_goes_here/data.csv")
|> File.stream!
|> MyParser.parse_stream
|> Stream.map(fn [_human_desc, _category, _length, videoid1, videoid2, videoid3, videoid4, videoid5, videoid6] ->
    sanitized_ids = CsvSanity.sanitize_video_ids([videoid1, videoid2, videoid3, videoid4, videoid5, videoid6])

    %{
        first_video_id: List.first(sanitized_ids),
        youtube_id_list: sanitized_ids
    }
end)
|> Enum.each(fn map -> 
    IO.puts inspect map

    changeset = YoutubeTv.Video.changeset(%YoutubeTv.Video{}, map)
    YoutubeTv.Repo.insert! changeset
end)

# http://youtube.com/watch?v=dqw4w9wgxcq&t=4
#   http://youtube.com/watch?
    # v=dqw4w9wgxcq
    # &t=4   