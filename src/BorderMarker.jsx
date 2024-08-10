import {AdvancedMarker} from "@vis.gl/react-google-maps";

function BorderMarker({borderSign}) {
    return (
        <AdvancedMarker
            position={borderSign}>
            <div
                style={{
                    position: 'absolute',
                    backgroundColor: (borderSign.generated ? '#cccccc' : '#99ff99'),
                    top: 0,
                    left: 0,
                    transform: 'translate(-50%, -50%)'
                }}>{borderSign.title}</div>
        </AdvancedMarker>
    );
}

export default BorderMarker;