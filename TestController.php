<?php

/*
	READ! THIS FILE IS NOT NEEDED!

    Its just an Example Controller taken for laravel to show how i'm communicating with my RESTS, but you
    can use your own REST method like a direct connection to database, just respect urls used
    when initializing js class and the returning JSON format.
	
	In this example my routes are:
	GET	index = "/users/"		-> return all users
	PUSH	store = "/users/ 		-> Make a new user using request data
	PATCH	update = "/users/{id}" 		-> Refresh user info (Id number needed on url)
	DELETE  delete = "/users/{id}"		-> Delete the selected user (Id number needed on url)

*/

class UserController
{
    public function index()
    {
        $users = User::all();
        return json_encode($users);
    }
	
    public function store(Request $request)
    {
        $user = User::create($request->all());
		
        return response()->json([
            'fail' => false
        ]);
    }
	
    public function show($id)
    {
        $user = User::find($id);
        return json_encode($user);
    }
	
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        $user->update($request->all());
        $user->save();

        return response()->json([
            'fail' => false
        ]);
    }
	
    public function destroy($id)
    {
        User::destroy($id);
    }
}
