using Bukmacher.Database;
using Bukmacher.Database.Models;
using Microsoft.AspNetCore.Mvc;
using Bukmacher.Server.Models.Dto;
using Bukmacher.Server.Helpers;
using Microsoft.EntityFrameworkCore;

namespace Bukmacher.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class IndividualBetsController : ControllerBase
    {
        private readonly ILogger<IndividualBetsController> _logger;
        private readonly DataContext _dataContext;
        private readonly IRefreshGamesScore _refreshGamesScore;
        public IndividualBetsController(ILogger<IndividualBetsController> logger, DataContext dataContext, IConfiguration configuration, IRefreshGamesScore refreshGamesScore)
        {
            _logger = logger;
            _dataContext = dataContext;
            _refreshGamesScore = refreshGamesScore;
        }

        [HttpPost]
        [Route("PostIndividualBet")] 
        public async Task<IActionResult> PostIndividualBet(AddBetModel model)
        {
            try
            {
                var userId = _dataContext.Users
                    .Where(x => x.Email == model.userName)
                    .Select(x => x.Id)
                    .FirstOrDefault();
                
                if (userId == null)
                    return BadRequest("User with this username do not exists");
                
                var homeTeam = _dataContext.Teams.FirstOrDefault(t => t.ExternalId == model.Game.TeamHomeId);
                if (homeTeam == null)
                {
                    homeTeam = new Team()
                    {
                        ExternalId = model.Game.TeamHomeId,
                        Name = model.Game.TeamHomeName,
                        Logo = model.Game.TeamHomeLogo
                    };
                    _dataContext.Teams.Add(homeTeam);
                }

                var awayTeam = _dataContext.Teams.FirstOrDefault(t => t.ExternalId == model.Game.TeamAwayId);
                if (awayTeam == null)
                {
                    awayTeam = new Team()
                    {
                        ExternalId = model.Game.TeamAwayId,
                        Name = model.Game.TeamAwayName,
                        Logo = model.Game.TeamAwayLogo
                    };
                    _dataContext.Teams.Add(awayTeam);
                }

                await _dataContext.SaveChangesAsync(); // Save the teams first

                var game = _dataContext.Matches.FirstOrDefault(m => m.ExternalId == model.Game.GameId);
                if (game == null)
                {
                    game = new Match()
                    {
                        ExternalId = model.Game.GameId,
                        HomeTeamId = homeTeam.Id,
                        HomeTeam = homeTeam,
                        AwayTeamId = awayTeam.Id,
                        AwayTeam = awayTeam
                    };
                    
                    _dataContext.Matches.Add(game);
                }
                await _dataContext.SaveChangesAsync(); // Save the match next

                var individualBet = new IndividualBet()
                {
                    PredictedHomeTeamScore = model.homeScore,
                    PredictedAwayTeamScore = model.awayScore,
                    Match = game,
                    UserId = userId
                };

                var result = await _dataContext.IndividualBets.AddAsync(individualBet);
                await _dataContext.SaveChangesAsync();
                
                return Ok();

            }
            catch(Exception ex)
            {
                return BadRequest(ex);
            }
        }
        [HttpGet]
        [Route("GetUserBet")] 
        public async Task<IActionResult> GetUserBet(string userName)
        {
            try
            {
                var userId = _dataContext.Users
                    .Where(x => x.Email == userName)
                    .Select(x => x.Id)
                    .FirstOrDefault();

                var bets = _dataContext.IndividualBets
                    .Include(x => x.Match)
                    .Include(x => x.Match.AwayTeam)
                    .Include(x => x.Match.HomeTeam)
                    .Where(x => x.UserId == userId)
                    .ToList();
                
                var gamesWithResult = bets
                    .Where(x => x.Match.AwayTeamScore != null)
                    .ToList();
                
                var gamesWithNoResult = bets
                    .Where(x => x.Match.AwayTeamScore == null)
                    .ToList();
                if (gamesWithNoResult.Count != 0)
                {
                    var refreshedGames = await _refreshGamesScore.DownloadSingleGame(gamesWithNoResult);
                    
                    foreach (var game in gamesWithNoResult)
                    {
                        var refreshedGame = refreshedGames.FirstOrDefault(x => x.fixture.id == game.Match.ExternalId);
                        if (refreshedGame != null)
                        {
                            game.Match.AwayTeamScore = refreshedGame.goals?.away;
                            game.Match.HomeTeamScore = refreshedGame.goals?.home;
                        }
                    }
                    
                    _dataContext.UpdateRange(gamesWithNoResult);
                    await _dataContext.SaveChangesAsync();
                }
                
                var refreshedBets = gamesWithResult.Concat(gamesWithNoResult).ToList();

                var adjustedBets = refreshedBets.Select(
                    bet => new GetUserBet.Root
                    {
                        Id = bet.Id,
                        UserId = bet.UserId,
                        MatchId = bet.MatchId,
                        Match = new GetUserBet.Match
                        {
                            Id = bet.Match.Id,
                            ExternalId = bet.Match.ExternalId,
                            AwayTeamId = bet.Match.AwayTeamId,
                            HomeTeamId = bet.Match.HomeTeamId,
                            HomeTeamScore = bet.Match.HomeTeamScore,
                            AwayTeamScore = bet.Match.AwayTeamScore,
                            Status = bet.Match.Status,
                            AwayTeam = new GetUserBet.AwayTeam
                            {
                                Id = bet.Match.AwayTeam.Id,
                                ExternalId = bet.Match.AwayTeam.ExternalId,
                                Logo = bet.Match.AwayTeam.Logo,
                                Name = bet.Match.AwayTeam.Name
                            },
                            HomeTeam = new GetUserBet.HomeTeam
                            {
                                Id = bet.Match.HomeTeam.Id,
                                ExternalId = bet.Match.HomeTeam.ExternalId,
                                Logo = bet.Match.HomeTeam.Logo,
                                Name = bet.Match.HomeTeam.Name
                            }
                        },
                        PredictedAwayTeamScore = bet.PredictedAwayTeamScore,
                        PredictedHomeTeamScore = bet.PredictedHomeTeamScore,
                        Points = bet.Points 
                    }
                );
                    
                return Ok(adjustedBets);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
