<?php

namespace App\Http\Controllers;

use App\Perftiming;
use Illuminate\Http\Request;

use App\Http\Requests;

class PerftimingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $perftimings = Perftiming::all();
        return json_encode($perftimings);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $perftiming = Perftiming::create($request->all());
        $perftiming->save();

        return response()->json([
            'fail' => false
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $perftiming = Perftiming::find($id);
        return json_encode($perftiming);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $perftiming = Perftiming::find($id);
        $perftiming->update($request->all());
        $perftiming->save();

        return response()->json([
            'fail' => false
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Perftiming::destroy($id);
    }
}
