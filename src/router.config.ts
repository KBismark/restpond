import { lazy } from "react";
import Dashboard from "./components/dashboard";
import { RouterConfigs } from "./components/router";
import EndpointsDashboard from "./components/endpoints";
import EndpointView from "./endpoint-view";

export const RouterConfig: RouterConfigs = {
  '/': EndpointView,
  '/:tab': Dashboard,
  '/projects/:id': EndpointView,
  '/projects/:id/:file/:routeName': EndpointView,
  '/endpoints': EndpointsDashboard
};