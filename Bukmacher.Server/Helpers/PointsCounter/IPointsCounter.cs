using Bukmacher.Database.Models;

namespace Bukmacher.Server.Helpers.PointsCounter;

public interface IPointsCounter
{
    public Task<List<IndividualBet>> RefreshPoints(List<IndividualBet> bets);
}