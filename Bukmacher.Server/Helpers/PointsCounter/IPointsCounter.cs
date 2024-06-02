using Bukmacher.Database.Models;

namespace Bukmacher.Server.Helpers.PointsCounter;

public interface IPointsCounter
{
    public Task<List<IndividualBet>> RefreshIndividualBetPoints(List<IndividualBet> bets);
    public Task<List<GroupBet>> RefreshGroupBetPoints(List<GroupBet> bets);
}