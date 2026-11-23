import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import MissionsView from "@/views/MissionsView.vue";
import MissionDetailView from "@/views/MissionDetailView.vue";
import ActivityView from "@/views/ActivityView.vue";
import MissionSummaryView from "@/views/MissionSummaryView.vue";
import PassportView from "@/views/PassportView.vue";
import RewardsView from "@/views/RewardsView.vue";
import RewardHistoryView from "@/views/RewardHistoryView.vue";
import MoreView from "@/views/MoreView.vue";
import AccessibilityView from "@/views/AccessibilityView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/inicio" },
    { path: "/inicio", name: "home", component: HomeView, meta: { nav: "home" } },
    { path: "/misiones", name: "missions", component: MissionsView, meta: { nav: "missions" } },
    { path: "/misiones/:missionId", name: "mission-detail", component: MissionDetailView, meta: { nav: "missions" } },
    { path: "/actividad/:activityId", name: "activity", component: ActivityView },
    { path: "/actividad-resumen/:missionId", name: "mission-summary", component: MissionSummaryView },
    { path: "/pasaporte", name: "passport", component: PassportView, meta: { nav: "passport" } },
    { path: "/premios", name: "rewards", component: RewardsView, meta: { nav: "rewards" } },
    { path: "/premios/historial", name: "reward-history", component: RewardHistoryView, meta: { nav: "rewards" } },
    { path: "/mas", name: "more", component: MoreView, meta: { nav: "more" } },
    { path: "/mas/accesibilidad", name: "accessibility", component: AccessibilityView, meta: { nav: "more" } },
    { path: "/:pathMatch(.*)*", redirect: "/inicio" }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
