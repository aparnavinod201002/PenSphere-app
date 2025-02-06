import { commonAPI  } from "./commonAPI";
import { server_url } from "./server_url";


export const registerAPI = async(user)=>{
    return await commonAPI('POST',`${server_url}/register`,user,"")
}


export const loginAPI = async(user)=>{
    return await commonAPI('POST',`${server_url}/login`,user,"")
}

    export const addPostAPI = async(reqBody,reqHeader)=>{
        return await commonAPI('POST',`${server_url}/addPosts`,reqBody,reqHeader)
}




export const getPublicPostsAPI = async()=>{
    return await commonAPI('GET',`${server_url}/publicPosts`,"","")
}


export const getMyPostsAPI = async(reqHeader)=>{
    return await commonAPI('GET',`${server_url}/myposts`,"",reqHeader)
}

export const addCommentAPI = async(reqBody,reqHeader)=>{
    return await commonAPI('POST',`${server_url}/addcomments`,reqBody,reqHeader)
}



export const getCommentsAPI = async(postId)=>{
    return await commonAPI('GET',`${server_url}/comments/${postId}`,"","")
}

export const getUserAPI = async(reqHeader)=>{
    return await commonAPI('GET',`${server_url}/user`,"",reqHeader)
}


export const deletePostAPI = async(id,reqHeader)=>{
    return await commonAPI('DELETE',`${server_url}/posts/remove/${id}`,{},reqHeader)
}



export const updatePostAPI = async(id,reqBody,reqHeader)=>{
    return await commonAPI('PUT',`${server_url}/posts/edit/${id}`,reqBody,reqHeader)
}


export const MostCommentedPostIdAPI = async(reqHeader)=>{
    return await commonAPI('GET',`${server_url}/postId`,"",reqHeader)
}




export const MostCommentedPostAPI = async(id,reqHeader)=>{
    return await commonAPI('GET',`${server_url}/MostcommentsPost/${id}`,"",reqHeader)
}