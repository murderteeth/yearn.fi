import {AnimatePresence, motion} from 'framer-motion';
import {HeroTimer} from '@common/components/HeroTimer';
import Meta from '@common/components/Meta';
import {CurveContextApp} from '@common/contexts/useCurve';
import {useCurrentApp} from '@common/hooks/useCurrentApp';
import {variants} from '@common/utils/animations';
import {BribesContextApp} from '@yBribe/contexts/useBribes';
import {getNextThursday} from '@yBribe/utils';

import type {NextRouter} from 'next/router';
import type {ReactElement} from 'react';

export function Wrapper({children, router}: {children: ReactElement; router: NextRouter}): ReactElement {
	const {manifest} = useCurrentApp(router);

	return (
		<div className={'mx-auto my-0 max-w-6xl pt-4 md:mb-0 md:mt-16'}>
			<Meta meta={manifest} />
			<CurveContextApp>
				<BribesContextApp>
					<AnimatePresence mode={'wait'}>
						<motion.div
							key={router.asPath}
							initial={'initial'}
							animate={'enter'}
							exit={'exit'}
							className={'my-0 h-full md:mb-0 md:mt-16'}
							variants={variants}>
							<HeroTimer endTime={getNextThursday()} />
							{children}
						</motion.div>
					</AnimatePresence>
				</BribesContextApp>
			</CurveContextApp>
		</div>
	);
}
