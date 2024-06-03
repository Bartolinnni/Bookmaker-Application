using Bukmacher.Core.FootballApiClient;
using Bukmacher.Database;
using Bukmacher.Database.Models;
using Microsoft.AspNetCore.Mvc;
using Bukmacher.Server.Models.Dto;
using Bukmacher.Server.Helpers;
using Bukmacher.Server.Helpers.PointsCounter;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Bukmacher.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GroupBetsController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly IPointsCounter _pointsCounter;
        private readonly IFootballApiClient _footballApiClient;
        public GroupBetsController(DataContext dataContext, IConfiguration configuration, IPointsCounter pointsCounter, IFootballApiClient footballApiClient)
        {
            _dataContext = dataContext;
            _pointsCounter = pointsCounter;
            _footballApiClient = footballApiClient;
        }

        [HttpPost]
        [Route("PostGroupBet")]
        public async Task<IActionResult> PostGroupBet(AddGroupBetModel model)
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

                await _dataContext.SaveChangesAsync();

                var game = _dataContext.Matches.FirstOrDefault(m => m.ExternalId == model.Game.GameId);
                if (game == null)
                {
                    game = new Match()
                    {
                        ExternalId = model.Game.GameId,
                        HomeTeamId = homeTeam.Id,
                        HomeTeam = homeTeam,
                        AwayTeamId = awayTeam.Id,
                        AwayTeam = awayTeam,
                        MatchDate = model.Game.Date
                    };

                    _dataContext.Matches.Add(game);
                }
                await _dataContext.SaveChangesAsync();

                var groupBets = model.groupsId.Select(groupId => new GroupBet()
                {
                    PredictedHomeTeamScore = model.homeScore,
                    PredictedAwayTeamScore = model.awayScore,
                    Match = game,
                    UserId = userId,
                    GroupId = groupId
                }).ToList();

                await _dataContext.GroupBets.AddRangeAsync(groupBets);
                await _dataContext.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
        [HttpGet]
        [Route("GetBetsByGroupId")]
        public async Task<IActionResult> GetBetsByGroupId(int groupId)
        {
            var groupBets = await _dataContext.GroupBets
                .Include(x => x.Match)
                .Include(x => x.Match.AwayTeam)
                .Include(x => x.Match.HomeTeam)
                .Where(x => x.GroupId == groupId)
                .ToListAsync();

            var userIds = groupBets.Select(bet => bet.UserId).Distinct().ToList();

            var userNames = await _dataContext.Users
                .Where(user => userIds.Contains(user.Id))
                .ToDictionaryAsync(user => user.Id, user => user.UserName);

            var gamesWithResult = groupBets
                .Where(x => x.Match.AwayTeamScore != null
                            || x.Match.MatchDate >= DateTime.Now)
                .ToList();

            var gamesWithNoResult = groupBets
                .Where(x => x.Match.AwayTeamScore == null
                            && x.Match.MatchDate < DateTime.Now)
                .ToList();

            if (gamesWithNoResult.Count != 0)
            {
                var ids = String.Join("-", gamesWithNoResult.Select(x => x.Match.ExternalId).ToList());
                var refreshedGames = await _footballApiClient.DownloadGamesByIds(ids);

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

            refreshedBets = await _pointsCounter.RefreshGroupBetPoints(refreshedBets);

            var adjustedBets = refreshedBets.Select(
                bet => new GetGroupBet.Root
                {
                    Id = bet.Id,
                    UserId = bet.UserId,
                    MatchId = bet.MatchId,
                    GroupId = bet.GroupId,
                    UserName = userNames.TryGetValue(bet.UserId, out var userName) ? userName : null,
                    Match = new GetGroupBet.Match
                    {
                        Id = bet.Match.Id,
                        ExternalId = bet.Match.ExternalId,
                        AwayTeamId = bet.Match.AwayTeamId,
                        HomeTeamId = bet.Match.HomeTeamId,
                        HomeTeamScore = bet.Match.HomeTeamScore,
                        AwayTeamScore = bet.Match.AwayTeamScore,
                        Status = bet.Match.Status,
                        AwayTeam = new GetGroupBet.AwayTeam
                        {
                            Id = bet.Match.AwayTeam.Id,
                            ExternalId = bet.Match.AwayTeam.ExternalId,
                            Logo = bet.Match.AwayTeam.Logo,
                            Name = bet.Match.AwayTeam.Name
                        },
                        HomeTeam = new GetGroupBet.HomeTeam
                        {
                            Id = bet.Match.HomeTeam.Id,
                            ExternalId = bet.Match.HomeTeam.ExternalId,
                            Logo = bet.Match.HomeTeam.Logo,
                            Name = bet.Match.HomeTeam.Name
                        }
                    },
                    PredictedAwayTeamScore = bet.PredictedAwayTeamScore,
                    PredictedHomeTeamScore = bet.PredictedHomeTeamScore,
                    Points = bet.Points,
                    PointDate = bet.PointDate
                }
            );

            if (adjustedBets == null)
            {
                return BadRequest("");
            }

            return Ok(adjustedBets);
        }
        [HttpGet]
        [Route("GetGamesToBet")]
        public async Task<IActionResult> GetGamesToBet(int groupId, string userName)
        {
            var user = await _dataContext.Users.FirstOrDefaultAsync(user => user.UserName == userName);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            var groupBets = await _dataContext.GroupBets
                .Include(x => x.Match)
                .Include(x => x.Match.AwayTeam)
                .Include(x => x.Match.HomeTeam)
                .Where(x => x.GroupId == groupId)
                .ToListAsync();

            var userBets = await _dataContext.GroupBets
                .Where(x => x.GroupId == groupId && x.UserId == user.Id)
                .ToListAsync();

            var userBetGameIds = userBets.Select(bet => bet.MatchId).ToHashSet();

            var gamesNotBetByUser = groupBets
                .Where(bet => !userBetGameIds.Contains(bet.MatchId))
                .Select(bet => bet.Match)
                .Distinct()
                .ToList();

            return Ok(gamesNotBetByUser);
        }
        [HttpPut]
        [Route("UpdateGroupBet")]
        public async Task<IActionResult> UpdateGroupBet([FromBody] UpdateBet model)
        {
            try
            {
                var groupBet = await _dataContext.GroupBets.Include(x => x.Match).FirstOrDefaultAsync(x => x.Id == model.Id);

                if (groupBet == null)//|| groupBet.Match.HomeTeamScore != null
                {
                    return BadRequest("You cannot update this bet.");
                }

                groupBet.PredictedAwayTeamScore = model.PredictedAwayTeamScore;
                groupBet.PredictedHomeTeamScore = model.PredictedHomeTeamScore;

                _dataContext.GroupBets.Update(groupBet);
                await _dataContext.SaveChangesAsync();

                return Ok("GroupBet updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete]
        [Route("DeleteGroupBet")]
        public async Task<IActionResult> DeleteGroupBet([FromQuery] int groupBetId)
        {
            try
            {
                var groupBet = await _dataContext.GroupBets.FirstOrDefaultAsync(bet => bet.Id == groupBetId);

                if (groupBet == null)
                {
                    return NotFound("Group bet not found.");
                }

                _dataContext.GroupBets.Remove(groupBet);
                await _dataContext.SaveChangesAsync();

                return Ok("Group bet deleted successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}