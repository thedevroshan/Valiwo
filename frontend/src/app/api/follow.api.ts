import api, {IAPIReturn} from "../config/api.config";


export const GetFollowersAPI = async ({username}:{username:string}):Promise<IAPIReturn> => {
    const res = await api.get(`api/v1/follow/followers?username=${username}`)
    return res.data;
}

export const GetFollowingAPI = async ({username}:{username:string}):Promise<IAPIReturn> => {
    const res = await api.get(`api/v1/follow/following?username=${username}`)
    return res.data;
}

export const FollowUnfollowAPI = async ({username}:{username:string}):Promise<IAPIReturn> => {
    const res = await api.put(`api/v1/follow/follow-unfollow?username=${username}`)
    return res.data;
}

export const RemoveFollowerAPI = async ({followerId}:{followerId:string}):Promise<IAPIReturn> => {
    const res = await api.put(`api/v1/follow/remove-follower?follower_id=${followerId}`)
    return res.data;
}