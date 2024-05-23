using Bukmacher.Server.Models.API;

namespace Bukmacher.Core.FootballApiClient;

public interface IFootballApiClient
{
    public Task<GameResponse.FixtureResponse> DownloadFutureGames(string leaugeId);
    public Task<GameResponse.FixtureResponse> DownloadLiveGames(string leaugeId);
    public Task<GameResponse.FixtureResponse> DownloadSingleGame(string gameId);
    public Task<List<GameResponse.Response>> DownloadGamesByIds(string ids);
}