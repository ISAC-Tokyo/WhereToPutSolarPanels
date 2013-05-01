/*global describe, it */
'use strict';
(function () {
    describe('Solar Panel Simulater', function () {
        describe('maybe a module exported', function () {
            it('should be exist wpsp.sp object', function () {
              expect(window.wpsp).to.be.a('object');
              expect(window.wpsp.sp).to.be.a('object');
              expect(window.wpsp.sp.SolarPanelSimulator).to.be.a('function');
            });

            it('should get simulator instance', function () {
              var ins = new wpsp.sp.SolarPanelSimulator({});
              expect(ins).to.be.a('object');
            });

            it('should get solar panel profiles', function () {
              var profiles = wpsp.sp.profiles;
              expect(profiles).to.be.a('array');
              expect(profiles[0].name).to.be('Solar A');
            });

            it('should get calculation result', function () {
              expect(window.wpsp).to.be.a('object');
              expect(window.wpsp.sp).to.be.a('object');
              expect(window.wpsp.sp.SolarPanelSimulator).to.be.a('function');
            });
        });
    });
})();
