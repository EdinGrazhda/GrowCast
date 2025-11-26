import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img
            src="/image/Smile.png"
            alt="App Logo"
            className="h-16 w-16 object-contain"
            style={{ ...props.style }}
        />
    );
}
