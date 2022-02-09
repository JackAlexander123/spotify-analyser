import {Bar, BarChart, Brush, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React from "react";

function Genres(props) {
    return (
        <div className="genres-content">
            <h2>Genres</h2>
            <p>Total count: {props.genres.length}</p>
            <p>Top genres:</p>
            <ol>
                {props.genres.slice(0, 5).map(name => (
                    <li key={name.name}>
                        <p>{name.name} - {name.occurrence} songs</p>
                    </li>
                ))}
            </ol>
            <h3>Full breakdown:</h3>
            {props.genres.length !== 0 ? (
                <div className="chart">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width="100%"
                            height={600}
                            data={props.genres}
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
                                domain={[0, props.genres.reduce((prev, current) => (prev.occurrence > current.occurrence) ? prev : current).occurrence]}
                                allowDecimals={false}
                            />
                            <Tooltip />
                            <Bar dataKey="occurrence" fill="#8884d8" />
                            <Brush dataKey='name' height={30} stroke="#8884d8" endIndex={25}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <p>Genres graph loading...</p>
            )}
        </div>
    );
}

export default Genres;
