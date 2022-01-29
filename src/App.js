import React, {useEffect} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import BarLeft from './components/BarLeft/BarLeft'
import BarMiddle from './components/BarMiddle/BarMiddle'
import BarRight from './components/BarRight/BarRight'
import Login from './components/Login/Login'
import Profile from './components/Profile/Profile'
import ProfileBarRight from './components/ProfileBarRight/ProfileBarRight'
import ProfileFollow  from './components/ProfileFollow/ProfileFollow'
import BottomNav from './elements/BottomNav/BottomNav'
import PostPage from './components/PostPage/PostPage'


import './App.css'


import {useStateValue} from './contexts/StateContextProvider'
import {actionTypes} from './contexts/StateReducers'

const App = () => {
  const [{user}, dispatch] = useStateValue()

  useEffect(() => {
      dispatch({
        type: actionTypes.SET_USER,
        user: JSON.parse(localStorage.getItem('noctua_user'))
      })    
  }, [])

  return (
    <div className="app">
    {
      user?
      <Router>  
        <div className="app__mainContent">
          <BarLeft />
          <Switch>
          <Route exact path={"/post/:postId"}>
            <PostPage />
          </Route>
            <Route exact path='/'>
                <div className="app__main">
                  <BarMiddle />
                  <BarRight />
                </div>         
            </Route>

            

            <Route path='/profile/:username' >
                <div className="app__main">
                  <Switch>
                    <Route path='/profile/:username' exact component={Profile} />
                    <Route path='/profile/:username/followinfo' render={()=> <ProfileFollow />} />
                  </Switch>
                  <ProfileBarRight />
                </div>         
            </Route>


          </Switch>
        </div>
        <BottomNav />
      </Router>
      :
      <Login />
    }
    </div>   
  )
}

export default App