import VotingPage from "@/pages/VotingPage";
import StatsPage from "@/pages/StatsPage";
import StatsPageImages from "@/components/StatsPageImages";
import StatsPageData from "@/components/StatsPageData";

const routes = [
    {path: '/',  component: VotingPage},
    {
        path: '/analytics',
        component: StatsPage,
        children: [
            {path: 'top', component: StatsPageImages},
            {path: 'bottom', component: StatsPageImages},
            {path: 'overview', component: StatsPageData}
        ]
    },
];

export default routes;