using System.Net;
using Bukmacher.Database;
using Bukmacher.Database.Models;
using Bukmacher.Server.Models.API;
using Microsoft.AspNetCore.Mvc;
using RestSharp;
using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace Bukmacher.Server.Helpers;

public class RefreshGamesScore : IRefreshGamesScore
{
    private readonly ILogger<RefreshGamesScore> _logger;
    private readonly DataContext _dataContext;
    private readonly IConfiguration Configuration;
    private readonly string ApiUrl = "https://api-football-v1.p.rapidapi.com";
    private readonly RestClient _client;
    private readonly string ApiToken;
    
    public RefreshGamesScore(ILogger<RefreshGamesScore> logger, DataContext dataContext, IConfiguration configuration)
    {
        _logger = logger;
        _dataContext = dataContext;
        _client = new RestClient(new Uri(ApiUrl));
        Configuration = configuration;
        ApiToken = Configuration["ConnectionStrings:ApiToken"];
    }
    
    public async Task<List<GameResponse.Response>> DownloadSingleGame(List<IndividualBet> bets)
    {
        var ids = String.Join("-", bets.Select(x => x.Match.ExternalId).ToList());
        
        var request = new RestRequest("/v3/fixtures", Method.Get);
        request.AddParameter("ids", ids);
        request.AddHeader("X-RapidAPI-Key", ApiToken);
        request.AddHeader("X-RapidAPI-Host", "api-football-v1.p.rapidapi.com");
        
        var response = await _client.ExecuteAsync(request);
        
        if (response.StatusCode != HttpStatusCode.OK)
            return null;
        await File.WriteAllTextAsync("C:\\Users\\barto_azqkiik\\OneDrive\\Pulpit\\nowePobranie.json", response.ToString());
        var fixtures = JsonConvert.DeserializeObject<GameResponse.FixtureResponse>(response.Content);

        return fixtures.response;
    }
}