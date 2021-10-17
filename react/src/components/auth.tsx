import React from 'react'
import {Redirect, useLocation } from 'react-router-dom'
import {setUserID} from '../utils/auth'

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

export default function Auth() {
    const query = useQuery()
    const steam_id = query.get('openid.identity')
    if (steam_id)
    setUserID(steam_id.split("/")[steam_id.split("/").length-1]);


    return <Redirect  to ="/"/>
}