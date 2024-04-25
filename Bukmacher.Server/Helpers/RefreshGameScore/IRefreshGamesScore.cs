using Bukmacher.Database.Models;
using Bukmacher.Server.Models.API;

namespace Bukmacher.Server.Helpers;

public interface IRefreshGamesScore
{
    public Task<List<GameResponse.Response>> DownloadSingleGame(List<IndividualBet> bets);
}