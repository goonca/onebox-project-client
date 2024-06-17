import 'ol/ol.css';
import { useEffect, useRef, useState } from 'react';
import { Feature, Map, View } from 'ol';
import { Tile } from 'ol/layer';
import { OSM } from 'ol/source';
import { GroupedHits } from '../../NewsGeneralPage';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { Geometry, Point } from 'ol/geom';
import KML from 'ol/format/KML.js';
import StadiaMaps from 'ol/source/StadiaMaps.js';
import { Circle as CircleStyle, Fill, Stroke } from 'ol/style.js';
import { Tile as TileLayer } from 'ol/layer.js';

import style from './StatisticsMap.module.scss';
import { fromLonLat } from 'ol/proj';

export type StatisticsMapProps = {
  groupedHits?: GroupedHits[];
};

export const StatisticsMap = (props: StatisticsMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [bounderies, setBounderies] = useState<{ max: number; min: number }>();
  const styleCache: any = {};
  const styleFunction = function (feature: any) {
    // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
    // standards-violating <magnitude> tag in each Placemark.  We extract it from
    // the Placemark's name instead.
    console.log(feature.get('hits'));
    const magnitude = (1 / 6) * feature.get('hits');
    const radius = 5 + 20 * (1 * magnitude);
    let style = styleCache[radius];
    if (!style) {
      style = new Style({
        image: new CircleStyle({
          radius: radius,
          fill: new Fill({
            color: 'rgba(255, 153, 0, 0.6)'
          }),
          stroke: new Stroke({
            color: 'rgba(255, 204, 0, 0.2)',
            width: 1
          })
        })
      });
      styleCache[radius] = style;
    }
    return style;
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const features = [];
    if (props.groupedHits) {
      const sorted = props.groupedHits.sort((a, b) => b.hits - a.hits);
      setBounderies({
        max: [...sorted].shift()?.hits ?? 0,
        min: [...sorted].pop()?.hits ?? 0
      });

      for (let i = 0; i < props.groupedHits.length; ++i) {
        const hit = props.groupedHits[i];
        const feat = new Feature(
          new Point(
            fromLonLat([
              //@ts-ignore
              hit.location.coordinates.coordinates[0],
              //@ts-ignore
              hit.location.coordinates.coordinates[1]
            ])
          )
        );
        feat.setProperties(hit);
        features.push(feat);
      }
    }

    const source = new VectorSource({
      features: features
    });

    const vector = new VectorLayer({
      source,
      style: styleFunction
    });

    const mapObj = new Map({
      //layers: [vector],
      view: new View({
        center: [-11000000, 4600000]
      }),
      target: mapRef.current,
      layers: [new Tile({ source: new OSM() }), vector]
    });

    mapObj.getView().fit(source.getExtent());
    mapObj.getView().setZoom((mapObj.getView().getZoom() as number) - 2);

    mapObj.setTarget(mapRef.current);

    return () => mapObj.setTarget('');
  }, [props.groupedHits]);

  /*useEffect(() => {
    setGroupedHits(props.groupedHits);
  }, [props.groupedHits]);*/

  return (
    <div className={style['statistics-map']}>
      <div ref={mapRef} className={style['wrapper']}></div>
    </div>
  );
};
