defmodule YoutubeTvWeb.Router do
  use YoutubeTvWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", YoutubeTvWeb do
    pipe_through :api

    get "/videos", VideoController, :index
    get "/getNextVideo", VideoController, :next

    post "/reportSkip", SkipController, :report
  end
end
