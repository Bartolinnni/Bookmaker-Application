export interface Bet {
    betId: number;
    matchDate: string;
    gameId: number;
    teamAwayId: number;
    teamAwayName: string;
    teamAwayLogo: string;
    teamHomeId: number;
    teamHomeName: string;
    teamHomeLogo: string;
    predictedHomeTeamScore:number,
    predictedAwayTeamScore: number
    points: number,
    homeTeamScore:number,
    awayTeamScore: number
}
