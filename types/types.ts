type AuthParams = {
    response_type: 'code',
    client_id: string,
    scope: string,
    code_challenge_method: 'S256',
    code_challenge: string,
    redirect_uri: string,
}

export type { AuthParams }