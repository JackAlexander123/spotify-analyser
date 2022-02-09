import {Bar, BarChart, Brush, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React from "react";

function Artists(props) {
    return (
        <div className="artists-content">
            <h2>Artists</h2>
            <p>Total count: {props.artists.length}</p>
            <p>Top artists:</p>
            <ol>
                {props.artistOccurrences.slice(0, 5).map(name => (
                    <li key={name.name}>
                        <p>{name.name} - {name.occurrence} songs</p>
                    </li>
                ))}
            </ol>
            <h3>Full breakdown:</h3>
            {props.artistOccurrences.length !== 0 ? (
                <div className="chart">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width="100%"
                            height={600}
                            data={props.artistOccurrences}
                            barSize={20}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-70} textAnchor="end" interval={0} height={200} />
                            <YAxis
                                interval={0}
                                tickCount={50}
                                type="number"
                                domain={[0, props.artistOccurrences.reduce((prev, current) => (prev.occurrence > current.occurrence) ? prev : current).occurrence]}
                                allowDecimals={false}
                            />
                            <Tooltip />
                            <Bar dataKey="occurrence" fill="#8884d8" />
                            <Brush dataKey='name' height={30} stroke="#8884d8" endIndex={25}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <p>Artists graph loading...</p>
            )}
        </div>
    );
}

export default Artists;
