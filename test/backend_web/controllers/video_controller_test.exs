defmodule YoutubeTvWeb.VideoControllerTest do
  use YoutubeTvWeb.ConnCase

  alias YoutubeTv.Videos
  alias YoutubeTv.Videos.Video

  @create_attrs %{}
  @update_attrs %{}
  @invalid_attrs %{}

  def fixture(:video) do
    {:ok, video} = Videos.create_video(@create_attrs)
    video
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all videos", %{conn: conn} do
      conn = get conn, video_path(conn, :index)
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create video" do
    test "renders video when data is valid", %{conn: conn} do
      conn = post conn, video_path(conn, :create), video: @create_attrs
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get conn, video_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id}
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, video_path(conn, :create), video: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update video" do
    setup [:create_video]

    test "renders video when data is valid", %{conn: conn, video: %Video{id: id} = video} do
      conn = put conn, video_path(conn, :update, video), video: @update_attrs
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get conn, video_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id}
    end

    test "renders errors when data is invalid", %{conn: conn, video: video} do
      conn = put conn, video_path(conn, :update, video), video: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete video" do
    setup [:create_video]

    test "deletes chosen video", %{conn: conn, video: video} do
      conn = delete conn, video_path(conn, :delete, video)
      assert response(conn, 204)
      assert_error_sent 404, fn ->
        get conn, video_path(conn, :show, video)
      end
    end
  end

  defp create_video(_) do
    video = fixture(:video)
    {:ok, video: video}
  end
end
