# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :backend,
  namespace: YoutubeTv,
  ecto_repos: [YoutubeTv.Repo]

# Configures the endpoint
config :backend, YoutubeTvWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "AGh0jHnc4DQrr+fjLTtBuiW3k1aZqIs+43fr8l9CoKQnTDAI/MCri8pRcNjE/2Em",
  render_errors: [view: YoutubeTvWeb.ErrorView, accepts: ~w(json)],
  pubsub: [name: YoutubeTv.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
