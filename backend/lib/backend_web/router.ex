defmodule YoutubeTvWeb.Router do
  use YoutubeTvWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", YoutubeTvWeb do
    pipe_through :api
  end
end
