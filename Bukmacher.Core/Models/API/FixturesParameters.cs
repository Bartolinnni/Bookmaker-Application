using System.Runtime.InteropServices.JavaScript;
using Microsoft.VisualBasic;

namespace Bukmacher.Server.Models.API;

public class FixturesParameters
{
    public string LeagueId { get; set; }
    public string Season { get; set; }
    public DateTime Date { get; set; }
}