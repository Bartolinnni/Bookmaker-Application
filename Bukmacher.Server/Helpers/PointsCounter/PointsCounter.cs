using Bukmacher.Database;
using Bukmacher.Database.Models;

namespace Bukmacher.Server.Helpers.PointsCounter;

public class PointsCounter : IPointsCounter
{
    private readonly DataContext _dataContext;

    public PointsCounter(DataContext dataContext)
    {
        _dataContext = dataContext;
    }
    public async Task<List<IndividualBet>> RefreshIndividualBetPoints(List<IndividualBet> bets)
    {
        foreach (var bet in bets.Where(bet => bet.Points == null && bet.Match.HomeTeamScore != null))
        {
            if (bet.Match.HomeTeamScore == bet.PredictedHomeTeamScore && bet.Match.AwayTeamScore == bet.PredictedAwayTeamScore)
                bet.Points = 3;
            else if ((bet.Match.HomeTeamScore == bet.Match.AwayTeamScore &&
                      bet.PredictedHomeTeamScore == bet.PredictedAwayTeamScore)
                     || (bet.Match.HomeTeamScore > bet.Match.AwayTeamScore &&
                         bet.PredictedHomeTeamScore > bet.PredictedAwayTeamScore)
                     || (bet.Match.HomeTeamScore < bet.Match.AwayTeamScore &&
                         bet.PredictedHomeTeamScore < bet.PredictedAwayTeamScore))
                bet.Points = 2;
            else
                bet.Points = -2;

            bet.PointDate = bet.Match.MatchDate;
            _dataContext.Update(bet);
        }

        await _dataContext.SaveChangesAsync();

        return bets;
    }
    public async Task<List<GroupBet>> RefreshGroupBetPoints(List<GroupBet> bets)
    {
        foreach (var bet in bets.Where(bet => bet.Points == null && bet.Match.HomeTeamScore != null))
        {
            if (bet.Match.HomeTeamScore == bet.PredictedHomeTeamScore && bet.Match.AwayTeamScore == bet.PredictedAwayTeamScore)
                bet.Points = 3;
            else if ((bet.Match.HomeTeamScore == bet.Match.AwayTeamScore &&
                      bet.PredictedHomeTeamScore == bet.PredictedAwayTeamScore)
                     || (bet.Match.HomeTeamScore > bet.Match.AwayTeamScore &&
                         bet.PredictedHomeTeamScore > bet.PredictedAwayTeamScore)
                     || (bet.Match.HomeTeamScore < bet.Match.AwayTeamScore &&
                         bet.PredictedHomeTeamScore < bet.PredictedAwayTeamScore))
                bet.Points = 2;
            else
                bet.Points = -2;

            bet.PointDate = bet.Match.MatchDate;
            _dataContext.Update(bet);
        }

        await _dataContext.SaveChangesAsync();

        return bets;
    }
}