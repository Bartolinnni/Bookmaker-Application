import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

const baseFolder =
    process.env.APPDATA !== undefined && process.env.APPDATA !== ''
        ? `${process.env.APPDATA}/ASP.NET/https`
        : `${process.env.HOME}/.aspnet/https`;

const certificateArg = process.argv.map(arg => arg.match(/--name=(?<value>.+)/i)).filter(Boolean)[0];
const certificateName = certificateArg ? certificateArg.groups.value : "bukmacher.client";

if (!certificateName) {
    console.error('Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.')
    process.exit(-1);
}

const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/login': {
                target: 'http://localhost:5271',
                secure: false,
            },
            '^/register': {
                target: 'http://localhost:5271',
                secure: false,
            },
            '^/DownloadFutureGames': {
                target: 'http://localhost:5271/FootballAPI',
                secure: false,
            },
            '^/PostIndividualBet': {
                target: 'http://localhost:5271/IndividualBets',
                secure: false,
            },
            '^/GetUserBet': {
                target: 'http://localhost:5271/IndividualBets',
                secure: false,
            },
            '^/GetUserBetsStatistics': {
                target: 'http://localhost:5271/IndividualBets',
                secure: false,
            },
            '^/GetUserGroups': {
                target: 'http://localhost:5271/Groups',
                secure: false,
            },
            '^/GetUsers': {
                target: 'http://localhost:5271/Users',
                secure: false,
            },
            '^/AddGroup': {
                target: 'http://localhost:5271/Groups',
                secure: false,
            },
            '^/PostGroupBet': {
                target: 'http://localhost:5271/GroupBets',
                secure: false,
            },
            '^/GetUserGroupById': {
                target: 'http://localhost:5271/Groups',
                secure: false,
            },
            '^/GetBetsByGroupId': {
                target: 'http://localhost:5271/GroupBets',
                secure: false,
            },
            '^/GetGamesToBet': {
                target: 'http://localhost:5271/GroupBets',
                secure: false,
            },
            '^/UpdateGroupBet': {
                target: 'http://localhost:5271/GroupBets',
                secure: false,
            },
            '^/DeleteGroupBet': {
                target: 'http://localhost:5271/GroupBets',
                secure: false,
            },
            '^/UpdateBet': {
                target: 'http://localhost:5271/IndividualBets',
                secure: false,
            },
            '^/DeleteBet': {
                target: 'http://localhost:5271/IndividualBets',
                secure: false,
            },
        },
        port: 5173,
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
