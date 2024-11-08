import React from 'react'
import { createBrowserRouter, isRouteErrorResponse, RouterProvider, useRouteError  } from 'react-router-dom';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en); // setting output timesince language as english

// importing global css that is going to be used on every page
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// importing layout component in which whole page structure is defined
import Layout from 'src/components/Layouts/Layout';
import Error404 from 'src/components/Layouts/error404';
import Error500 from 'src/components/Layouts/Error500';

// routes/url.jsx have all urls defined in a map
import {ROUTES} from 'src/routes/urls';

import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  BarController,
  LineController,
  LineElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
  PieController,
} from 'chart.js';
// Register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  LineController,
  DoughnutController,
  ArcElement,
  PieController,
  Title,
  Tooltip,
  Legend
);

// all pages components are declared here
const HOME = React.lazy(() => import("src/pages/Home"))
const RANKINGS = React.lazy(() => import("src/pages/Rankings/Rankings"))
const NEWS = React.lazy(() => import("src/pages/News/index"))
const NEWS_DETAIL = React.lazy(() => import("src/pages/News/show"))
const PLAYERS = React.lazy(() => import("src/pages/Players/index"))
const PLAYERS_DETAIL = React.lazy(() => import("src/pages/Players/show"))
const TEAMS = React.lazy(() => import("src/pages/Teams/index"))
const TEAMS_DETAIL = React.lazy(() => import("src/pages/Teams/show"))
const SERIES = React.lazy(() => import("src/pages/Series/index"))
const SERIES_DETAIL = React.lazy(() => import("src/pages/Series/show"))
const GROUNDS = React.lazy(() => import("src/pages/Grounds/index"))
const GROUNDS_DETAIL = React.lazy(() => import("src/pages/Grounds/show"))
const LIVESCORES = React.lazy(() => import("src/pages/LiveScore/index"))
const MATCH_DETAIL = React.lazy(() => import("src/pages/Matches/show"))

// a function that will return the component based on error status
// going to pass to create browser router below
function ErrorHandler(){
  const error = useRouteError()

  // if item not found or page not found error
  if (isRouteErrorResponse(error) && error.status == 404)
  {
    return <Error404 />
  }
  // if a server error
  else if(isRouteErrorResponse(error) && error.status == 500)
  {
    return <Error500 />
  }

  return <Error404 />
}

export default function App(){
  // console.log(routes)
  //  all routes of page are defined here
  let router = createBrowserRouter([
    {
      // parent page or master page
      path: "/",
      element: <Layout />,

      
      // if page was not found associated with route 
      errorElement: <ErrorHandler />,
      

      // child page which are going to be filled inside parent element
      children: [
        {
          path: ROUTES.HOME,  // path is url that will be mapped to element component below
          element: <HOME />,
          
        },
        {
          path: ROUTES.LIVESCORES,
          element: <LIVESCORES />,
        },
        {
          path: ROUTES.MATCH_SHOW,
          element: <MATCH_DETAIL />,
          caseSensitive: false,
          // loading data before page loaded
          loader: async function ({params}){
            let series_slug = params.series_slug
            let slug = params.match_slug
            let response = await fetch(`http://127.0.0.1:8000/api/series/${series_slug}/${slug}`)
            
            if (response.status == 404)
              throw new Response("Page Not Found", {status: 404})
            if (!response.ok)
              throw new Response("Page Not Responding Try Again!", {status: 500})
            
            return response.json()
          },
        },
        {
          path: ROUTES.RANKINGS,
          element: <RANKINGS />,
        },
        {
          path: ROUTES.NEWS,
          element: <NEWS />,
        },
        {
          path: ROUTES.NEWS_SHOW,
          element: <NEWS_DETAIL />,
        },
        {
          path: ROUTES.PLAYERS,
          element: <PLAYERS />,
          loader: async function ({params}){
            
            let response = await fetch(`http://127.0.0.1:8000/api/players/countries`)
            
            if (response.status == 404)
              throw new Response("Page Not Found", {status: 404})
            if (!response.ok)
              throw new Response("Page Not Responding Try Again!", {status: 500})
            
            return response.json()
          },
        },
        {
          path: ROUTES.PLAYERS_SHOW,
          element: <PLAYERS_DETAIL />,
          caseSensitive: false,
          loader: async function ({params}){
            let slug = params.slug
            let response = await fetch(`http://127.0.0.1:8000/api/players/${slug}`)
            
            if (response.status == 404)
              throw new Response("Page Not Found", {status: 404})
            if (!response.ok)
              throw new Response("Page Not Responding Try Again!", {status: 500})
            
            return response.json()
          },
        },
        {
          path: ROUTES.TEAMS,
          element: <TEAMS />,
          // loading data before page loaded
          loader: async function ({params}){
            let response = await fetch(`http://127.0.0.1:8000/api/teams`)
            
            if (response.status == 404)
              throw new Response("Page Not Found", {status: 404})
            if (!response.ok)
              throw new Response("Page Not Responding Try Again!", {status: 500})
            
            return response.json()
          },
        },
        {
          path: ROUTES.TEAMS_SHOW,
          element: <TEAMS_DETAIL />,
          loader: async function ({params}){
            let slug = params.slug
            let response = await fetch(`http://127.0.0.1:8000/api/teams/${slug}`)
            
            if (response.status == 404)
              throw new Response("Page Not Found", {status: 404})
            if (!response.ok)
              throw new Response("Page Not Responding Try Again!", {status: 500})
            
            return response.json()
          },
        },
        {
          path: ROUTES.SERIES,
          element: <SERIES />,
          loader: async function ({params}){
                      
            let response = await fetch(`http://127.0.0.1:8000/api/series`)
            
            if (response.status == 404)
              throw new Response("Page Not Found", {status: 404})
            if (!response.ok)
              throw new Response("Page Not Responding Try Again!", {status: 500})
            
            return response.json()
          },
        },
        {
          path: ROUTES.SERIES_SHOW,
          element: <SERIES_DETAIL />,
          loader: async function ({params}){
            let slug = params.slug
            let response = await fetch(`http://127.0.0.1:8000/api/series/${slug}`)
            
            if (response.status == 404)
              throw new Response("Page Not Found", {status: 404})
            if (!response.ok)
              throw new Response("Page Not Responding Try Again!", {status: 500})
            
            return response.json()
          },
        },
        {
          path: ROUTES.GROUNDS,
          element: <GROUNDS />,
          loader: async function ({params}){
            
            let response = await fetch(`http://127.0.0.1:8000/api/grounds/countries`)
            
            if (response.status == 404)
              throw new Response("Page Not Found", {status: 404})
            if (!response.ok)
              throw new Response("Page Not Responding Try Again!", {status: 500})
            
            return response.json()
          },
        },
        {
          path: ROUTES.GROUNDS_SHOW,
          element: <GROUNDS_DETAIL />,
          loader: async function ({params}){
            let slug = params.slug
            let response = await fetch(`http://127.0.0.1:8000/api/grounds/${slug}`)
            
            if (response.status == 404)
              throw new Response("Page Not Found", {status: 404})
            if (!response.ok)
              throw new Response("Page Not Responding Try Again!", {status: 500})
            
            return response.json()
          },
        },
      ]
    }
  ])




  // now setting router for the application to handle routes and responses  againt the routes
  return (
    <RouterProvider router={router} />
  );
}